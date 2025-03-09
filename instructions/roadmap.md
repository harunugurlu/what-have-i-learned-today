# Project Implementation Roadmap

## Step 1: Create the Data Model

### Summary
Created the base data model for the application, including the Entity interface and all required domain entities.

### Completed
- Created the base `Entity` interface with `id`, `createdAt`, and `updatedAt` fields
- Created the `User` entity with `username`, `email`, and `streak` fields
- Created the `LearningLog` entity with `userId`, `title`, `details`, and `colorId` fields
- Created the `Color` entity with `name` and `hexCode` fields
- Created the `Tag` entity with `name` field
- Created the `LearningLogTag` entity for the many-to-many relationship between `LearningLog` and `Tag`
- Created a `ServerResponse` interface for standardized API responses

### Next Steps
- Proceed to Step 2: Add Supabase to the Project (Including Authentication)

### Known Issues
- None at this time

### Questions
- None at this time

## Step 2: Add Supabase to the Project (Including Authentication)

### Summary
Set up Supabase integration with the Next.js project, including authentication flow with Google Sign-In, protected routes, and database tables.

### Completed
- Verified existing Supabase setup in the project (client, server, middleware)
- Created authentication-related directories and files:
  - Login page with Google authentication
  - Auth callback route to handle OAuth redirects
  - Sign-out route for user logout
- Set up protected and public route groups:
  - Protected layout that checks for authentication
  - Public home page with redirect to dashboard for authenticated users
  - Dashboard page in the protected route group
- Created SQL migration file for database tables:
  - Users table linked to Supabase Auth
  - Colors table with default color options
  - Tags table for categorizing learning logs
  - Learning logs table for storing user entries
  - Learning log tags table for many-to-many relationships
- Implemented Row Level Security (RLS) policies for all tables
- Added necessary assets (logo, Google logo)

### Next Steps
- Proceed to Step 3: Implement Basic Authentication Flow

### Known Issues
- None at this time

### Questions
- None at this time

## Step 3: Implement Basic Authentication Flow

### Summary
Enhanced the authentication flow by adding reusable components, context providers, utility functions, and email/password authentication.

### Completed
- Fixed linter errors in the authentication flow by properly awaiting the Supabase client creation
- Created authentication-related actions in `lib/actions/auth.ts`:
  - `getCurrentUser`: Function to get the current authenticated user with profile data
  - `signOut`: Function to sign out the current user
  - `updateUserProfile`: Function to update the user's profile data
- Created user-related components:
  - `UserProfile`: Component to display user information and sign-out button
  - `UserProvider`: Context provider to make user data available throughout the app
- Updated protected routes to use the new authentication components and functions:
  - Protected layout now uses the `UserProvider` to provide user data to all child components
  - Dashboard layout now uses the `UserProfile` component for consistent user display
  - Dashboard page now uses the `getCurrentUser` function to get user data
- Implemented email/password authentication:
  - Created a signup page with email, username, and password fields
  - Updated the login page to include email/password login
  - Created a forgot password page for password recovery
  - Created a reset password page for setting a new password
  - Updated the auth callback route to handle both Google OAuth and email/password signup
  - Updated the public home page to include links to both login and signup pages

### Next Steps
- Proceed to Step 4: UI & Design (Global)

### Known Issues
- None at this time

### Questions
- None at this time

## Step 4: UI & Design (Global)

### Summary
Implemented a light + dark theme system, set up a consistent color palette, and created shared layouts for different route groups.

### Completed
- Implemented a theme system with light, dark, and system options:
  - Created a `ThemeProvider` component to manage theme state
  - Created a `ThemeToggle` component to switch between themes
  - Updated the root layout to include the theme provider
- Set up a consistent color palette in the global CSS:
  - Defined color variables for both light and dark themes
  - Used a primary color of indigo (#4F46E5) for branding
  - Ensured proper contrast ratios for accessibility
- Created shared layouts for different route groups:
  - Public layout for unauthenticated users
  - Auth layout for login/signup pages
  - Protected layout for authenticated users
  - Dashboard layout for the main application
- Added consistent header and footer components to all layouts
- Ensured responsive design for all layouts

### Next Steps
- Proceed to Step 5: Main Page – Calendar Layout

### Known Issues
- None at this time

### Questions
- None at this time

## Bug Fixes Before Step 5

### Summary
Fixed various UI and functionality issues before proceeding with Step 5.

### Completed
- Fixed authentication routing issues:
  - Updated middleware to allow access to the signup route
  - Added proper public route handling for all auth-related pages
- Fixed dark theme issues:
  - Added `bg-background` class to header, main, and footer elements
  - Ensured text and border colors adapt properly to dark mode
  - Fixed contrast issues for better readability
- Improved UI consistency and usability:
  - Enhanced button styling for better visual clarity
  - Added `hover:cursor-pointer` to all clickable elements
  - Replaced custom dropdown menu with shadcn's dropdown-menu component
  - Added proper padding to navbar and footer
  - Adjusted light mode to use a slightly more gray background
  - Improved spacing and alignment in layouts
  - Enhanced form input styling for better user experience
- Additional UI improvements:
  - Created a TypeScript-based Tailwind configuration file
  - Made the light background darker with a blue-gray tint (220 14% 96%)
  - Fixed the "Sign In with Email" button visibility issue by using explicit indigo colors
  - Added shadow and improved hover states for buttons
  - Enhanced Google sign-in button with better border and hover states
  - Added consistent button styling across all auth pages

### Next Steps
- Proceed to Step 5: Main Page – Calendar Layout

### Known Issues
- None at this time

### Questions
- None at this time

### **Step 5: Main Page – Calendar Layout**

#### Summary of Development
We have implemented the main page with a weekly calendar interface. The calendar displays the current week with each day as a column, showing the date range (e.g., "March 10–17, 2025") as the title. The current day is highlighted, and future days are disabled to prevent users from adding entries for future dates.

We've also added a user profile section in the top-right corner that displays the user's username and streak status. The calendar is designed to show learning logs within each day column, and the entire day column is clickable for adding new learning logs.

#### What is Completed So Far
1. Created a reusable Calendar component that:
   - Displays a weekly calendar view with days as columns
   - Allows navigation between weeks
   - Highlights the current day
   - Disables future days
   - Shows learning logs within each day column
   - Makes the entire day column clickable for adding new logs
   - Displays a plus icon on hover for empty days

2. Added a user profile section in the top-right corner showing:
   - The user's username
   - The current streak status

3. Updated the main page to:
   - Fetch and display the user's profile information
   - Fetch learning logs from the database
   - Display the calendar with learning logs
   - Show streak information and recent tags

4. Fixed an issue with event handlers:
   - Converted the main page from a Server Component to a Client Component
   - Updated the data fetching approach to work in a Client Component
   - Properly transformed the user data to match the expected User interface

5. Redesigned the calendar layout:
   - Changed from monthly to weekly view
   - Made each day a column with sufficient width for content
   - Made day columns clickable for adding new learning logs
   - Added visual feedback when hovering over days
   - Improved the display of learning logs within days

6. Further improved the calendar design:
   - Made the calendar larger and more prominent on the page (80% of the width)
   - Redesigned day columns to have continuous vertical borders
   - Removed gaps between columns for a more cohesive look
   - Added subtle background highlighting for the current day
   - Increased the height of day columns for better content display
   - Added shadows to learning log cards for better visual hierarchy
   - Improved spacing and padding throughout the calendar
   - Used faded gray color for vertical borders between columns
   - Removed top and bottom borders for a cleaner look
   - Enhanced the user profile section with a more distinct and visually appealing design

#### Next Steps
1. Implement the modal for adding new learning logs when a user clicks on a valid date (Step 6)
2. Create the learning log detail view when a user clicks on an existing log
3. Implement proper error handling for data fetching
4. Add loading states for better user experience

#### Known Issues
1. The calendar layout might need adjustments for mobile responsiveness
2. The data fetching could be optimized to reduce the number of database queries
3. Type safety could be improved for the Supabase query results

#### Questions
None at this time.

### **Step 6: Adding New Learning Log (Modal)**

#### Summary of Development
We have implemented a modal interface for adding new learning logs when a user clicks on a valid date in the calendar. The implementation uses shadcn's Dialog component, Zod for form validation, and React Hook Form for form handling. We've also organized the database operations as server actions for better separation of concerns.

#### What is Completed So Far
1. Created server actions for database operations:
   - `getColors`: Fetches available colors from the database
   - `getTags`: Fetches available tags from the database
   - `createTag`: Creates a new tag if it doesn't exist
   - `createLearningLog`: Creates a new learning log with tags
   - `getLearningLogs`: Fetches learning logs for the current user

2. Implemented a LearningLogDialog component using shadcn's Dialog:
   - Used Zod for form validation schema
   - Used React Hook Form for form state management
   - Implemented proper loading states and error handling
   - Added a clean UI with proper spacing and visual hierarchy

3. Enhanced the form with advanced features:
   - Color selection with visual feedback
   - Tag management with suggested tags
   - Markdown support for the details field
   - Form validation with error messages
   - Loading indicators during submission

4. Improved the user experience:
   - Added loading states during data fetching and form submission
   - Implemented proper error handling and display
   - Added visual feedback for user interactions
   - Ensured the form resets when closed

5. Updated the main page to:
   - Use the new LearningLogDialog component
   - Use the server action for fetching learning logs
   - Implement proper error handling
   - Refresh the page after a new learning log is created

#### Next Steps
1. Create the learning log detail view when a user clicks on an existing log
2. Implement editing and deleting functionality for learning logs
3. Add markdown rendering for the details field
4. Improve error handling and validation
5. Add loading states for better user experience

#### Known Issues
1. The dialog might need adjustments for mobile responsiveness
2. The tag input could be improved with autocomplete functionality
3. The color selection UI could be enhanced with color names on hover

#### Questions
None at this time.

### **Step 7: Learning Log Components & Display**

#### Summary of Development
We have implemented the learning log display functionality, allowing users to view the details of their learning logs when they click on an existing log in the calendar. The implementation includes a modal dialog that displays the log's title, details, metadata, and tags, with proper markdown rendering for the content.

#### What is Completed So Far
1. Created server actions for learning log operations:
   - `getLearningLogById`: Fetches a single learning log with all its details
   - Enhanced the existing actions with better type safety and error handling

2. Implemented a LearningLogDetails component:
   - Displays the learning log title, details, date, time, color, and tags
   - Renders markdown content using react-markdown
   - Provides a clean and organized layout for the information
   - Handles loading states and errors gracefully

3. Enhanced the Calendar component:
   - Added functionality to handle clicks on existing learning logs
   - Improved the visual feedback when hovering over logs
   - Fixed event propagation to distinguish between clicking on a day vs. a log
   - Added a new prop to pass the selected log ID to the parent component

4. Updated the main page to:
   - Handle viewing learning log details
   - Fetch learning log details when a log is selected
   - Manage state for the details dialog
   - Provide proper loading and error states

5. Added markdown support:
   - Installed react-markdown for rendering markdown content
   - Added the Tailwind typography plugin for better markdown styling
   - Configured the typography plugin in the Tailwind config

#### Next Steps
1. Implement editing functionality for learning logs
2. Add delete functionality for learning logs
3. Enhance the markdown editor with a preview
4. Implement filtering and searching for learning logs
5. Add pagination for better performance with many logs

#### Known Issues
1. The markdown rendering might need additional styling for better readability
2. The details dialog might need adjustments for mobile responsiveness
3. The calendar layout could be improved for better display of multiple logs on the same day

#### Questions
None at this time.

### **Step 8: Learning Log Editing & Deletion**

#### Summary of Development
We have implemented the editing and deletion functionality for learning logs, allowing users to modify or remove their existing entries. The implementation includes a dedicated edit dialog that reuses much of the form logic from the creation dialog, as well as a delete button with proper confirmation and error handling.

#### What is Completed So Far
1. Created server actions for learning log operations:
   - `updateLearningLog`: Updates an existing learning log with new data
   - `deleteLearningLog`: Deletes a learning log and its associated tag relationships

2. Implemented a LearningLogEdit component:
   - Reuses the form structure from the LearningLogDialog component
   - Pre-populates the form with the existing learning log data
   - Handles form submission and validation
   - Provides proper loading states and error handling
   - Includes a delete button for removing the learning log

3. Enhanced the LearningLogDetails component:
   - Added an edit button that opens the edit dialog
   - Improved the layout and styling of the details view
   - Added proper state management for the edit dialog

4. Updated the main page to:
   - Handle deleting learning logs
   - Refresh the data after a learning log is deleted
   - Provide proper error handling for delete operations

5. Added safety features:
   - Implemented a confirmation dialog for deleting learning logs
   - Used shadcn's AlertDialog component for the confirmation UI
   - Added clear warning messages about the permanent nature of deletion
   - Ensured the dialog closes properly after actions are taken

#### Next Steps
1. Enhance the markdown editor with a preview
2. Implement filtering and searching for learning logs
3. Add pagination for better performance with many logs
4. Improve the UI for mobile devices

#### Known Issues
1. The edit dialog might need adjustments for mobile responsiveness
2. The form validation could be improved with more specific error messages

#### Questions
None at this time.
