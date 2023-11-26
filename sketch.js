let pursuer;
let target;
let obstacles = [];
let cars = []
let debug = true
let iswandering = true
let ennemies = []
function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer = new Vehicle(100, 100);
  cars.push(pursuer)
  for(let i=0;i<3;i++)
  {
    let car = new Vehicle(random(width),random(height))
    cars.push(car)
  }

  // On cree un obstalce au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacle = new Obstacle(width/2, height/2, 100);
  obstacles.push(obstacle);
}

function draw() {
  background(0);
 
//   pursuer.applyBehaviors(obstacles,cars)
 
  //let steering = cars[0].applyBehaviors(target, obstacles,cars);
  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
 circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  })
  ennemies.forEach(o => {
    o.show();
  })

  pursuer. applyBehaviors(target, obstacles,cars) 

 

  
//   cars.forEach(o => {
//     let steering = o.applyBehaviors(target, obstacles,cars);
//     o.applyForce(steering)
//     o.update();
//     o.show();
//     o.edges();
    
//   })
 
  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
 
//   pursuer.applyForce(steering);

//   // déplacement et dessin du véhicule et de la target
//   pursuer.update();
//   pursuer.show();
//   pursuer.edges();
}

function mousePressed() {
  ennemy = new Ennemy(mouseX, mouseY, random(5, 60))
  ennemies.push(ennemy);
    for(let i=0;i<cars.length;i++)
    {
        let v = cars[i]
        v.maxSpeed=0
        steering = v.seek(ennemy)
        v.applyForce(steering)
    }
  
}

function keyPressed() {
  if (key == "d") {
    console.log("d pressed")
    debug = !debug;
  } 
  else if(key=="c")
  {
    console.log("c pressed")
    iswandering=!iswandering;
  }
  else if(key=="n")
  {
    let v = new Vehicle(random(width),random(height))
    cars.push(v)
  }
  else if(key=="o")
  {
    obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
    obstacles.push(obstacle);
  }
}