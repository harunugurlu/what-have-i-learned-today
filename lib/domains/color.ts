import { Entity } from './common'

/**
 * Color entity representing a color option for learning logs
 */
export interface Color extends Entity {
	/**
	 * Name of the color
	 */
	name: string
	
	/**
	 * Hexadecimal color code
	 */
	hexCode: string
} 