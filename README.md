# RPS-Multiplayer

This multiplayer rock-paper-scissors game is built completely on the front-end, relying on Firebase's real-time database for multi-user functionality. The styling was made with the Materialize CSS framework.

**Check out the live app at:** https://cezarcarvalhaes.github.io/RPS-Multiplayer/

*This app was developed by Cezar Carvlhaes in 2018.*

---

**Getting Started**
Users simply navigate to the page, and the first user submits a name to become Player 1, and the second user will be player 2. Once both users are 'signed-in' the game begins. Each player then alternates turns selecting rock, paper or scissors. The game will keep score. Users can also chat with each other below the main game window. 

Once a user disconnects, their information is automatically deleted from the real-time database and a new user can take their place. The other user can continue playing however. If both users disconnect from the page, all information is deleted, and two new users can take their place. 
