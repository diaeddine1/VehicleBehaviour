/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
  function findProjection(pos, a, b) {
    let v1 = p5.Vector.sub(a, pos);
    let v2 = p5.Vector.sub(b, pos);
    v2.normalize();
    let sp = v1.dot(v2);
    v2.mult(sp);
    v2.add(pos);
    return v2;
  }
  
  class Vehicle {
    constructor(x, y) {
      // position du véhicule
      this.pos = createVector(x, y);
      // vitesse du véhicule
      this.vel = createVector(0, 0);
      // accélération du véhicule
      this.acc = createVector(0, 0);
      // vitesse maximale du véhicule
      this.maxSpeed = 4;
      // force maximale appliquée au véhicule
      this.maxForce = 0.3;
      // rayon du véhicule
      this.r_original = 16;
      this.r=50;
      // Pour évitement d'obstacle
      this.largeurZoneEvitementDevantVaisseau = 40;
      this.wanderTheta = PI / 2;
      this.displaceRange = 0.3;
      this.pathMaxLength = 50;
  
      this.path = [];
    }
  
    wander() {
      // point devant le véhicule
      let wanderPoint = this.vel.copy();
      wanderPoint.setMag(100);
      wanderPoint.add(this.pos);
      
      // on le dessine sous la forme d'une petit cercle rouge
       //fill(255, 0, 0);
       //noStroke();
       //circle(wanderPoint.x, wanderPoint.y, 8);
  
      // Cercle autour du point
      let wanderRadius = 50;
       //noFill();
       //stroke(255);
       //circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);
  
       // on dessine une lign qui relie le vaisseau à ce point
       // c'est la ligne blanche en face du vaisseau
       //line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
  
       // On va s'occuper de calculer le point vert SUR LE CERCLE
       // il fait un angle wanderTheta avec le centre du cercle
       // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
       // + cet angle
      let theta = this.wanderTheta + this.vel.heading();
  
      let x = wanderRadius * cos(theta);
      let y = wanderRadius * sin(theta);
  
      // maintenant wanderPoint c'est un point sur le cercle
      wanderPoint.add(x, y);
  
      // on le dessine sous la forme d'un cercle vert
       //fill(0, 255, 0);
       //noStroke();
       //circle(wanderPoint.x, wanderPoint.y, 16);
  
       // on dessine le vecteur desiredSpeed qui va du vaisseau au poibnt vert
       //stroke(255);
       //line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
  
       // On a donc la vitesse désirée que l'on cherche qui est le vecteur
       // allant du vaisseau au cercle vert. On le calcule :
       // ci-dessous, steer c'est la desiredSpeed directement !
      let steer = wanderPoint.sub(this.pos);
  
      steer.setMag(this.maxForce);
      //this.applyForce(steer);
  
      // On déplace le point vert sur le cerlcle (en radians)
      this.displaceRange = 0.3;
      this.wanderTheta += random(-this.displaceRange, this.displaceRange);
      return steer;
    }
  
    // on fait une méthode applyBehaviors qui applique les comportements
    // seek et avoid
    applyBehaviors(target, obstacles,cars) {
       /** for(let i = 0; i< cars.length;i++)
        {
          let v = cars[i]
         // let steering = v.applyBehaviors(target, obstacles,cars);
            let steering
            if(i==0)
            {
                //v.arrive(target)
                steering = v.wander()
                console.log("number 0")
                
        
            }
            else
            {
                steering = v.arrive(cars[i-1].pos)
                
                
            }
            v.applyForce(steering)
            v.update();
            v.show();
            v.edges();
            
        }*/
        for(let i = 0; i< cars.length;i++)
        {
          let v = cars[i]
         // let steering = v.applyBehaviors(target, obstacles,cars);
            let steering
            if(i==0)
            {
              if(iswandering)
              {
              steering = v.wander()
              }
              else
              {
                  steering = v.arrive(target)
      
              }
                //v.arrive(target)
              
      
        
          }
            else
            {
              if(iswandering)
              {
              steering = v.wander()
              }
              else
              {
                  steering = v.arrive(cars[i-1].pos)
              }
               
                
            }
            let avoidForce = v.avoidAmeliore(obstacles,cars)
            avoidForce.mult(0.5);
            let TotalForce = p5.Vector.add(steering,avoidForce)
      
            v.applyForce(TotalForce)
            v.update();
            v.show();
            v.edges();
            
        }
        
        
    

        
     // let seekForce = this.arrive(target);
      
    //   let avoidForce = this.avoidAmeliore(obstacles,cars);
    //   let wanderForce = this.arrive(target)
    //   //let avoidForce = this.avoidAmeliore(obstacles);
  
    //   //seekForce.mult(0.2);
    //  // wanderForce.mult(0.2);
    //   avoidForce.mult(0.5);
    //   let totalForce = p5.Vector.add(wanderForce, avoidForce);
    //   this.applyForce(totalForce);
    }
  
    avoid(obstacles) {
      // calcul d'un vecteur ahead devant le véhicule
      // il regarde par exemple 50 frames devant lui
      let ahead = this.vel.copy();
      ahead.normalize();
      ahead.mult(100);
  
      
      // on le dessine
      this.drawVector(this.pos, ahead, "lightblue");
  
      // Detection de l'obstacle le plus proche
      let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);
  
      // On calcule la distance entre le cercle et le bout du vecteur ahead
      let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);
      // On dessine ce point pour debugger
      fill("red");
      noStroke();
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
  
      // On dessine la zone d'évitement
      // On trace une ligne large qui va de la position du vaisseau
      // jusqu'au point au bout de ahead
      stroke(color(255, 200, 0, 90)); // gros, semi transparent
      strokeWeight(this.largeurZoneEvitementDevantVaisseau);
      line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
  
      let distance = pointAuBoutDeAhead.dist(obstacleLePlusProche.pos);
      //console.log("distance = " + distance)
  
      // si la distance est < rayon de l'obstacle
      // il y a collision possible et on dessine l'obstacle en rouge
      if (distance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
        // collision possible
        obstacleLePlusProche.color = "red";
        // calcul de la force d'évitement. C'est un vecteur qui va
        // du centre de l'obstacle vers le point au bout du vecteur ahead
        let force = p5.Vector.sub(pointAuBoutDeAhead, obstacleLePlusProche.pos);
        // on le dessine pour vérifier qu'il est ok (dans le bon sens etc)
        this.drawVector(obstacleLePlusProche.pos, force, "yellow");
  
        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        force.setMag(this.maxSpeed);
        // on calcule la force à appliquer pour atteindre la cible
        force.sub(this.vel);
        // on limite cette force à la longueur maxForce
        force.limit(this.maxForce);
        return force;
      } else {
        // pas de collision possible
        obstacleLePlusProche.color = "green";
        return createVector(0, 0);
      }
    }
  
    /* 
      Version avec deux vecteurs ahead et ahead2 (deux fois plus court) et 
      donc deux zones d'évitement. On adapte aussi en plus ces vecteurs à la vitesse du véhicule
      Plus le véhicule va vite plus il regarde loin...
    */
    avoidAmeliore(obstacles,cars) {
      // calcul d'un vecteur ahead devant le véhicule
      // il regarde par exemple 50 frames devant lui
      let ahead = this.vel.copy();
      ahead.normalize();
      ahead.mult(100 * this.vel.mag()*0.4);
  
      // Deuxième vecteur deux fois plus petit
      let ahead2 = ahead.copy();
      ahead2.mult(0.5);
  
      // on les dessine
      this.drawVector(this.pos, ahead, "lightblue");
      this.drawVector(this.pos, ahead2, "red");
  
      // Detection de l'obstacle le plus proche
      let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles,cars);
  
      // On calcule la distance entre le cercle et le bout du vecteur ahead
      let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);
      let pointAuBoutDeAhead2 = p5.Vector.add(this.pos, ahead2);
  
      // On dessine ce point pour debugger
      fill("red");
      noStroke();
      if(debug)
      {
        circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
  
        // On dessine la zone d'évitement
        // On trace une ligne large qui va de la position du vaisseau
        // jusqu'au point au bout de ahead
        stroke(color(255, 200, 0, 90)); // gros, semi transparent
        strokeWeight(this.largeurZoneEvitementDevantVaisseau);
        line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
  
      }
   
  
      let distance1 = pointAuBoutDeAhead.dist(obstacleLePlusProche.pos);
      let distance2 = pointAuBoutDeAhead2.dist(obstacleLePlusProche.pos);
      // on tient compte aussi de la position du vaisseau
      let distance3 = this.pos.dist(obstacleLePlusProche.pos);
  
      let plusPetiteDistance = min(distance1, distance2);
      plusPetiteDistance = min(plusPetiteDistance, distance3)
  
      let pointDeReference;
  
      if(distance1 < distance2) {
        pointDeReference = pointAuBoutDeAhead;
      } else {
        pointDeReference = pointAuBoutDeAhead2;
      }
  
      let alerteRougeVaisseauEnCollision = false;
      if((distance3 < distance1) && (distance3 < distance2)) {
        pointDeReference = this.pos;
        alerteRougeVaisseauEnCollision = true;
      }
  
      //console.log("distance = " + distance)
  
      // si la distance est < rayon de l'obstacle
      // il y a collision possible et on dessine l'obstacle en rouge
      if (plusPetiteDistance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau+this.r) {
        // collision possible
        obstacleLePlusProche.color = "red";
        // calcul de la force d'évitement. C'est un vecteur qui va
        // du centre de l'obstacle vers le point au bout du vecteur ahead
        let force = p5.Vector.sub(pointDeReference, obstacleLePlusProche.pos);
        // on le dessine pour vérifier qu'il est ok (dans le bon sens etc)
        if(debug)
        {
          this.drawVector(obstacleLePlusProche.pos, force, "yellow");
        }
       
  
        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        force.setMag(this.maxSpeed);
        // on calcule la force à appliquer pour atteindre la cible
        force.sub(this.vel);
        // on limite cette force à la longueur maxForce
        force.limit(this.maxForce);
  
        if(alerteRougeVaisseauEnCollision) {
          force.setMag(this.maxForce*2);
        }
        return force;
      } else {
        // pas de collision possible
        obstacleLePlusProche.color = "green";
        return createVector(0, 0);
      }
    }
    getObstacleLePlusProche(obstacles,cars) {
      let plusPetiteDistance = 100000000;
      let obstacleLePlusProche;
  
      obstacles.forEach(o => {
        // Je calcule la distance entre le vaisseau et l'obstacle
        const distance = this.pos.dist(o.pos);
        if(distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          obstacleLePlusProche = o;
          
        }
  
      });
      //Je cherche le vehicule le plus proche sauf lui meme
      cars.forEach(o => {
        // Je calcule la distance entre le vaisseau et l'obstacle
        if(o!=this)
        {
          const distance = this.pos.dist(o.pos);
  
        if(distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          obstacleLePlusProche = o;
          
        }
  
        }
        
  
      });
  
  
      return obstacleLePlusProche;
    }
    
  
    getClosestObstacle(pos, obstacles,cars) {
      // on parcourt les obstacles et on renvoie celui qui est le plus près du véhicule
      let closestObstacle = null;
      let closestDistance = 1000000000;
      for (let obstacle of obstacles) {
        let distance = pos.dist(obstacle.pos);
        if (closestObstacle == null || distance < closestDistance) {
          closestObstacle = obstacle;
          closestDistance = distance;
        }
      }
      return closestObstacle;
    }
  
    arrive(target) {
      // 2nd argument true enables the arrival behavior
      return this.seek(target, true);
    }
  
    seek(target, arrival = false) {
      let force = p5.Vector.sub(target, this.pos);
      let desiredSpeed = this.maxSpeed;
      if (arrival) {
        let slowRadius = 100;
        let distance = force.mag();
        if (distance < slowRadius) {
          desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
        }
      }
      force.setMag(desiredSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    }
  
    // inverse de seek !
    flee(target) {
      return this.seek(target).mult(-1);
    }
  
    /* Poursuite d'un point devant la target !
       cette methode renvoie la force à appliquer au véhicule
    */
    pursue(vehicle) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
    // applyForce est une méthode qui permet d'appliquer une force au véhicule
    // en fait on additionne le vecteurr force au vecteur accélération
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
      // (accélératiion = dérivée de la vitesse)
      this.vel.add(this.acc);
      // on contraint la vitesse à la valeur maxSpeed
      this.vel.limit(this.maxSpeed);
      // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
      // (la vitesse est la dérivée de la position)
      this.pos.add(this.vel);
  
      // on remet l'accélération à zéro
      this.acc.set(0, 0);
    }
  
    // On dessine le véhicule
    show() {
     
      // formes fil de fer en blanc
      stroke(255);
      // épaisseur du trait = 2
      strokeWeight(2);
  
      // formes pleines en blanc
      fill(255);
  
      // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
      // position et rotation du repère de référence)
      push();
      // on déplace le repère de référence.
      translate(this.pos.x, this.pos.y);
      // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
      rotate(this.vel.heading());
  
      // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
      triangle(-this.r_original, -this.r_original / 2, -this.r_original, this.r_original / 2, this.r_original, 0);
      // Que fait cette ligne ?
      //this.edges();
  
      // draw velocity vector
      pop();
      this.drawVector(this.pos, this.vel, color(255, 0, 0));
  
      //cercle autour du vaisseau pour evitement entre vaisseau
      if(debug)
      {  stroke("white")
      noFill()
  
      circle(this.pos.x,this.pos.y,this.r);
  
      }
    
      
    }
  
    drawVector(pos, v, color) {
      if(debug)
      {
        push();
        // Dessin du vecteur vitesse
        // Il part du centre du véhicule et va dans la direction du vecteur vitesse
        strokeWeight(3);
        stroke(color);
        line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
        // dessine une petite fleche au bout du vecteur vitesse
        let arrowSize = 5;
        translate(pos.x + v.x, pos.y + v.y);
        rotate(v.heading());
        translate(-arrowSize / 2, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
  
      }
  
    }
  
    // que fait cette méthode ?
    edges() {
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
      } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
      }
    }
   
  }
  
  class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(5);
    }
  
    show() {
      push();
      stroke(255);
      strokeWeight(2);
      fill("#F063A4");
      push();
      translate(this.pos.x, this.pos.y);
      circle(0, 0, this.r * 2);
      pop();
      pop();
    }
  }