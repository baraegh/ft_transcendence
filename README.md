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
![localhost_5173_](https://github.com/baraegh/ft_transcendence/assets/46541419/6f0f163d-4602-4737-8775-9d01d3ef4a71)
**Home:**
![localhost_5173_home (11)](https://github.com/baraegh/ft_transcendence/assets/46541419/d77cbb1f-5b51-4dd0-8658-4df215accf0f)
**Chat:**
![localhost_5173_home (5) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/7c7e1e9e-4b3a-41b0-a025-fc1de3d315c4)
![localhost_5173_home (4) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/30a86028-1b0a-49d3-b945-0eaf85312b7e)
**Profile:**
![localhost_5173_home (3) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/e0e7a4a7-bcaf-4c57-a163-1fe0f614b1ee)
**LeaderBoard:**
![localhost_5173_home (10)](https://github.com/baraegh/ft_transcendence/assets/46541419/134657ea-b003-401b-8e08-3bc1dd5d5ef6)
**Game:**
![localhost_5173_home (7) (2)](https://github.com/baraegh/ft_transcendence/assets/46541419/df2033d9-3f40-409a-8ae4-fc5ea3c51f89)
![localhost_5173_home (8) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/0424fc69-26ef-43dc-bc47-93b2688bba1e)
![localhost_5173_home (9) (1)](https://github.com/baraegh/ft_transcendence/assets/46541419/e90ed8db-a88e-47b1-9e6b-5d6a44fae67e)
