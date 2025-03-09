import { Entity } from './common'

/**
 * LearningLog entity representing a daily learning entry
 */
export interface LearningLog extends Entity {
	/**
	 * ID of the user who created this learning log
	 */
	userId: string
	
	/**
	 * Title of the learning log
	 */
	title: string
	
	/**
	 * Detailed content of what was learned (in markdown format)
	 */
	details: string
	
	/**
	 * ID of the color associated with this learning log
	 */
	colorId: string
} 