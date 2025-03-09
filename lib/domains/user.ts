import { Entity } from './common'

/**
 * User entity representing a user in the system
 */
export interface User extends Entity {
	/**
	 * Username of the user
	 */
	username: string
	
	/**
	 * Email address of the user
	 */
	email: string
	
	/**
	 * Current streak count of consecutive days with learning logs
	 */
	streak: number
} 