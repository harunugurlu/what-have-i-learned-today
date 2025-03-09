import { Entity } from './common'

/**
 * Tag entity representing a tag that can be applied to learning logs
 */
export interface Tag extends Entity {
	/**
	 * Name of the tag
	 */
	name: string
} 