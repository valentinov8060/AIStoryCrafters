import * as SQLite from 'expo-sqlite';

/**
 * Initialize the database.
 */
export async function initializeDatabase () {
  try {
    const db = await SQLite.openDatabaseAsync('stories');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY NOT NULL, 
        synopsis TEXT, 
        story TEXT
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.log(error);
  }
};

/**
 * Save a story to the database.
 * @param {string} synopsis - The synopsis of the story.
 * @param {string} story - The story itself.
 */
export async function saveStoryToDatabase (synopsis: string, story: string) {
  try {
    const db = await SQLite.openDatabaseAsync('stories');
  
    await db.runAsync(`
      INSERT INTO stories (synopsis, story) VALUES (?, ?);
    `, [synopsis, story]);
    console.log('Story saved to database');
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get all stories from the database.
 * @returns {Array} An array of stories.
 */
export async function getStoriesFromDatabase (): Promise<any> {
  try {
    const db = await SQLite.openDatabaseAsync('stories');

    const stories = await db.getAllAsync(`SELECT * FROM stories`);
    console.log('Stories retrieved from database');
    return stories;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Delete a story from the database.
 * @param {number} id - The id of the story to delete.
 */
export async function deleteStoryFromDatabase (id: number) {
  try {
    const db = await SQLite.openDatabaseAsync('stories');

    await db.runAsync(`
      DELETE FROM stories WHERE id = ?;
    `, [id]);
    console.log('Story deleted from database');
  } catch (error) {
    console.log(error);
  }
}
