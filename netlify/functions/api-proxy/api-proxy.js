// Netlify Function to proxy HTTP API requests
// This allows the frontend to make requests to HTTP backend APIs through Netlify

exports.handler = async (event, context) => {
  // Get the backend API URL from environment variable
  // Set this in Netlify dashboard: API_URL=http://178.156.220.94/api/v1
  // The function will automatically convert HTTP to HTTPS

  // Only allow specific HTTP methods
  if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    }
  }

  try {
    // Get the path from the event
    // The redirect sends /api/* to /.netlify/functions/api-proxy/:splat
    // So :splat contains everything after /api/ (e.g., "login" for /api/login)
    let apiPath = event.path

    // Remove the function path prefix to get the original /api/* path
    if (apiPath.startsWith('/.netlify/functions/api-proxy')) {
      apiPath = apiPath.replace('/.netlify/functions/api-proxy', '')
    } else if (apiPath.startsWith('/api-proxy')) {
      apiPath = apiPath.replace('/api-proxy', '')
    }

    // Ensure path starts with / (if it's not empty)
    if (apiPath && !apiPath.startsWith('/')) {
      apiPath = '/' + apiPath
    }
    
    // If path is empty, set to empty string (don't add /)
    if (!apiPath || apiPath === '/') {
      apiPath = ''
    }

    // Get base API URL and convert HTTP to HTTPS
    let baseApiUrl = process.env.API_URL || 'http://178.156.220.94/api/v1'
    
    // Convert HTTP to HTTPS
    if (baseApiUrl.startsWith('http://')) {
      baseApiUrl = baseApiUrl.replace('http://', 'https://')
    }

    // Construct the full API URL
    // baseApiUrl already includes /api/v1, so we just append the path
    const queryString = event.rawQuery ? `?${event.rawQuery}` : ''
    const apiUrl = `${baseApiUrl}${apiPath}${queryString}`
    
    // Log for debugging (remove in production if needed)
    console.log('Proxy request:', {
      originalPath: event.path,
      extractedPath: apiPath,
      baseUrl: baseApiUrl,
      finalUrl: apiUrl
    })

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    }

    // Forward authorization header if present
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization
    }

    // Forward other important headers
    if (event.headers['x-requested-with']) {
      headers['X-Requested-With'] = event.headers['x-requested-with']
    }

    // Prepare request options
    const requestOptions = {
      method: event.httpMethod,
      headers,
    }

    // Add body for POST, PUT, PATCH requests
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      requestOptions.body = event.body
    }

    // Make the request to the backend API
    const response = await fetch(apiUrl, requestOptions)

    // Get response body
    const contentType = response.headers.get('content-type') || 'application/json'
    let body

    if (contentType.includes('application/json')) {
      body = JSON.stringify(await response.json())
    } else {
      body = await response.text()
    }

    // Get all response headers
    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Return response with appropriate headers
    return {
      statusCode: response.status,
      headers: {
        ...responseHeaders,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body,
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Proxy error',
        message: error.message,
      }),
    }
  }
}
