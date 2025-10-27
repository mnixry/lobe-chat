import { and, desc, eq } from 'drizzle-orm';

import {
  NewUserMemoryIdentity,
  userMemories,
  userMemoriesContexts,
  userMemoriesExperiences,
  userMemoriesIdentities,
  userMemoriesPreferences,
} from '../schemas/userMemories';
import { LobeChatDatabase } from '../type';

export class UserMemoryModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  /**
   * Query all user memories
   */
  queryMemories = async () => {
    return this.db.query.userMemories.findMany({
      orderBy: [desc(userMemories.updatedAt)],
      where: eq(userMemories.userId, this.userId),
    });
  };

  /**
   * Count total memories
   */
  countMemories = async () => {
    const result = await this.db
      .select()
      .from(userMemories)
      .where(eq(userMemories.userId, this.userId));

    return result.length;
  };

  /**
   * Query all contexts
   */
  queryContexts = async () => {
    // Get all memory IDs for this user first
    const userMemoryIds = await this.db
      .select({ id: userMemories.id })
      .from(userMemories)
      .where(eq(userMemories.userId, this.userId));

    const memoryIdSet = new Set(userMemoryIds.map((m) => m.id));

    const allContexts = await this.db.query.userMemoriesContexts.findMany({
      orderBy: [desc(userMemoriesContexts.updatedAt)],
    });

    // Filter contexts that belong to user's memories
    return allContexts.filter((context) => {
      const memoryIds = (context.userMemoryIds as string[]) || [];
      return memoryIds.some((id) => memoryIdSet.has(id));
    });
  };

  /**
   * Query all preferences
   */
  queryPreferences = async () => {
    const userMemoryIds = await this.db
      .select({ id: userMemories.id })
      .from(userMemories)
      .where(eq(userMemories.userId, this.userId));

    const memoryIdSet = new Set(userMemoryIds.map((m) => m.id));

    const allPreferences = await this.db.query.userMemoriesPreferences.findMany({
      orderBy: [desc(userMemoriesPreferences.updatedAt)],
    });

    return allPreferences.filter((pref) => pref.userMemoryId && memoryIdSet.has(pref.userMemoryId));
  };

  /**
   * Query all identities
   */
  queryIdentities = async () => {
    const userMemoryIds = await this.db
      .select({ id: userMemories.id })
      .from(userMemories)
      .where(eq(userMemories.userId, this.userId));

    const memoryIdSet = new Set(userMemoryIds.map((m) => m.id));

    const allIdentities = await this.db.query.userMemoriesIdentities.findMany({
      orderBy: [desc(userMemoriesIdentities.updatedAt)],
    });

    return allIdentities.filter((identity) => identity.userMemoryId && memoryIdSet.has(identity.userMemoryId));
  };

  /**
   * Query all experiences
   */
  queryExperiences = async () => {
    const userMemoryIds = await this.db
      .select({ id: userMemories.id })
      .from(userMemories)
      .where(eq(userMemories.userId, this.userId));

    const memoryIdSet = new Set(userMemoryIds.map((m) => m.id));

    const allExperiences = await this.db.query.userMemoriesExperiences.findMany({
      orderBy: [desc(userMemoriesExperiences.updatedAt)],
    });

    return allExperiences.filter((exp) => exp.userMemoryId && memoryIdSet.has(exp.userMemoryId));
  };

  /**
   * Find memory by ID
   */
  findById = async (id: string) => {
    return this.db.query.userMemories.findFirst({
      where: and(eq(userMemories.id, id), eq(userMemories.userId, this.userId)),
    });
  };

  // ============ Identity CRUD Operations ============

  /**
   * Create a new identity
   */
  createIdentity = async (data: NewUserMemoryIdentity) => {
    // Verify the userMemoryId belongs to this user if provided
    if (data.userMemoryId) {
      const memory = await this.findById(data.userMemoryId);
      if (!memory) {
        throw new Error('Memory not found or access denied');
      }
    }

    const result = await this.db.insert(userMemoriesIdentities).values(data).returning();
    return result[0];
  };

  /**
   * Update an identity
   */
  updateIdentity = async (id: string, data: Partial<NewUserMemoryIdentity>) => {
    // First verify the identity belongs to this user
    const identity = await this.findIdentityById(id);
    if (!identity) {
      throw new Error('Identity not found or access denied');
    }

    const result = await this.db
      .update(userMemoriesIdentities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userMemoriesIdentities.id, id))
      .returning();
    return result[0];
  };

  /**
   * Delete an identity
   */
  deleteIdentity = async (id: string) => {
    // First verify the identity belongs to this user
    const identity = await this.findIdentityById(id);
    if (!identity) {
      throw new Error('Identity not found or access denied');
    }

    await this.db.delete(userMemoriesIdentities).where(eq(userMemoriesIdentities.id, id));
  };

  /**
   * Find identity by ID
   */
  findIdentityById = async (id: string) => {
    const identity = await this.db.query.userMemoriesIdentities.findFirst({
      where: eq(userMemoriesIdentities.id, id),
    });

    if (!identity || !identity.userMemoryId) {
      return null;
    }

    // Verify the identity belongs to this user by checking the parent memory
    const memory = await this.findById(identity.userMemoryId);
    if (!memory) {
      return null;
    }

    return identity;
  };
}
