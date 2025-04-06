
// No type definitions needed in JS, just documentation comments

/*
 * User object structure:
 * {
 *   id: string,
 *   username: string,
 *   isAdmin: boolean,
 *   avatar?: string
 * }
 */

/*
 * Message types: 'text' | 'image' | 'video' | 'audio'
 */

/*
 * Message object structure:
 * {
 *   id: string,
 *   senderId: string,
 *   receiverId: string,
 *   content: string,
 *   type: string ('text', 'image', 'video', 'audio'),
 *   timestamp: Date,
 *   isRead: boolean,
 *   status?: string ('pending', 'resolved')
 * }
 */
