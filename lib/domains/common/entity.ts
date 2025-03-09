/**
 * Base entity interface that all domain entities should extend
 */
export interface Entity {
	/**
	 * Unique identifier for the entity
	 */
	id: string
	
	/**
	 * Timestamp when the entity was created
	 */
	createdAt: Date
	
	/**
	 * Timestamp when the entity was last updated
	 */
	updatedAt: Date
} 