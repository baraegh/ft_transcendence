# ft_transcendence

## Overview
ft_transcendence is a web application designed for the mighty Pong contest. It enables users to engage in real-time multiplayer online Pong games while offering additional features such as chat and user account management.

## Project Requirements
- **Backend:** The project's backend is built using NestJS.
- **Frontend:** The frontend is developed using React.js with TypeScript.
- **Database:** PostgreSQL is used as the primary database.
- **Single-Page Application:** The website is designed as a single-page application with support for browser navigation.
  Browser Compatibility: The website is compatible with the latest stable version of Google Chrome and one 
  additional web browser of our choice.
- **Error Handling:** The website ensures a smooth user experience with no unhandled errors or warnings.
- **Docker:** The project can be launched with a single call to docker-compose up --build, including support for Docker in rootless mode for Linux.

## Security Concerns

To ensure the security of our application, we've implemented the following measures:

- **Password Hashing:**  All passwords stored in the database are securely hashed.
- **SQL Injection Prevention:**  The website is protected against SQL injection attacks.
- **Server-side Validation:**  Forms and user inputs are validated on the server-side to prevent malicious input.

**Note:**
  Please note that sensitive information such as credentials and API keys are stored locally in a .env file and are not committed to the Git repository for       security reasons.

## User Account

- **OAuth Login:** Users can log in using the OAuth system of the 42 intranet.
- **Unique Usernames:** Users can choose a unique display name for their profile.
- **Avatar Upload:** Users can upload avatars, with a default avatar provided for those who don't.
- **Two-Factor Authentication:** Users can enable two-factor authentication for enhanced security.
- **Friends and Status:** Users can add friends, see their current status, and view stats on their profile.
- **Match History:** A comprehensive match history is available, including 1v1 games and ladder matches.

## Chat
Our chat feature allows users to:

- Create public, private, or password-protected chat channels.
- Send direct messages to other users.
- Block unwanted users to stop receiving messages.
- Set channel passwords and manage channel administration.
- Invite other users to play Pong games through the chat interface.
- Access other player's profiles via the chat interface.

## Game
The core feature of the website is playing Pong:

- Users can play live Pong games directly on the website.
- A matchmaking system allows users to find opponents automatically.
- Customization options are available, including power-ups and different maps.
- The game is responsive and faithful to the original Pong (1972).

## ScreeShots:
**Landing Page:**
![localhost_5173_](https://github.com/baraegh/ft_transcendence/assets/46541419/808c7837-7ad3-4145-b41a-1c08d710606e)
**Home:**
![localhost_5173_home (11)](https://github.com/baraegh/ft_transcendence/assets/46541419/931e2f10-475d-433f-b736-4ddd0e63f380)
**Chat:**
![localhost_5173_home (5) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/5d9d7efe-b44c-4c6c-8ce3-de6d32771419)
![localhost_5173_home (4) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/465815f4-3430-4edd-84ba-335bdc0f6da2)
**Profile:**
![localhost_5173_home (3) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/76852264-1e91-4c38-b0f6-a027258a3af2)
**LeaderBoard:**
![localhost_5173_home (10)](https://github.com/baraegh/ft_transcendence/assets/46541419/8e28b925-7799-4e9d-baa7-4b77120cc393)
**Game:**
![localhost_5173_home (7) (2)](https://github.com/baraegh/ft_transcendence/assets/46541419/ebe30135-c072-4da8-ba1c-707a83dc4435)
![localhost_5173_home (8) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/c229546f-dadb-4312-bb41-3a66983e4670)
![localhost_5173_home (9) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/657e0f9e-323a-4d1e-8a7b-90610b3b9512)







