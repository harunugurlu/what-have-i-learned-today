/**
 * Standard server response interface for API endpoints
 */
export interface ServerResponse<T> {
	/**
	 * Whether the request was successful
	 */
	success: boolean
	
	/**
	 * Optional error message if the request failed
	 */
	error?: string
	
	/**
	 * Optional data returned from the server
	 */
	data?: T
} 