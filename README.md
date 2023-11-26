## Vehicles Behaviours

When you run the application on live server, the vehicles exhibit the following behaviours:

- **Wander and Obstacle Avoidance:**
  - All vehicles start with both wander and obstacle avoidance behaviours.
  
- **Behavior Switching:**
  - Press the keyboard button `C` to trigger a behavior switch:
    - The first vehicle adopts an arrive behaviour towards the cursor position.
    - Other vehicles change their wander behaviour to arrive towards the vehicle before them in the indexed array.

- **Stop and Face New Enemy:**
  - Click the mouse to add a new obstacle at the cursor position.
  - All vehicles stop and turn to face the newly created enemy.
  - They exhibit a behaviour (in progress) to shoot small vehicles as bullets towards the enemy until it is destroyed.
