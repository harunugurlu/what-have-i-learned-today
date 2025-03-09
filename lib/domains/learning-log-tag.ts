import { Entity } from './common'

/**
 * LearningLogTag entity representing a many-to-many relationship between LearningLog and Tag
 */
export interface LearningLogTag extends Entity {
	/**
	 * ID of the learning log
	 */
	learningLogId: string
	
	/**
	 * ID of the tag
	 */
	tagId: string
} 