/**
 * Created by pablo-user on 18/04/16.
 */


/*
SIEMPRE ME MUEVO A LA MAXIMA VELOCIDAD
Formulas para el seek behavior

 1. vector(desired velocity) = (target position) – (vehicle position)   :  se crea un vector desde el vehiculo hasta el target
 2. normalize vector(desired velocity)                                  :  se normaliza dicho vector, es decir, se lo lleva a un vector unitario con dicho sentido
 3. scale vector(desired velocity) to maximum speed                     :  se le da la magnitud de la maxima velocidad. Multiplicar por un scalar
 4. vector(steering force) = vector(desired velocity) – vector(current velocity)  se calcula la fuerza que dirigira el vehiculo al target.
 5. limit the magnitude of vector(steering force) to maximum force                se limita la fuerza a una maxima fuerza
 6. vector(new velocity) = vector(current velocity) + vector(steering force)      se calcula el nuevo vector de velocidad para el vehiculo
 7.  se la limita a la maxima velocidad
 */

 //Valores para seek

 const MAX_SPEED=300;
 const MAX_DIST=100;
 //Valores para Wander
 const CIRCLE_DISTANCE=80;
 const CIRCLE_RADIUS=25;
 const ANGLE_CHANGE=8;
 //const MAX_TIME=100;
 //var tiempo = Date.now();
 var target = new Phaser.Math.Vector2(Math.abs(Math.random()*800),Math.abs(Math.random()*600));
 var wanderAngle = 10;

 function seek(vehiculo, objetivo){
         //Obtengo VectorDeseado
         var VectorDeseado = calcularVelocidadDeseada(vehiculo, objetivo);

         //Obtengo el vector Steering
         var vectorSteeringForce = calcularSteeringForce(vehiculo.body.velocity, VectorDeseado);

         //aplico el vector de fuerza al vehiculo
         aplicarVectorDeFuerza(vehiculo,vectorSteeringForce);

    }

    function wander(vehiculo){
           var circleCenter = vehiculo.body.velocity.clone();
           circleCenter.normalize();
           circleCenter.scale(CIRCLE_DISTANCE)
           var displacement = new Phaser.Math.Vector2(Math.random(),Math.random());
           displacement.scale(CIRCLE_RADIUS)


           // Cambia aleatoriamente la direccion del vector al cambiar su angulo
           setAngle(displacement, wanderAngle);

           // FIX: cambia muy lieramente el angulo para el sgte frame
           wanderAngle += Math.random() * ANGLE_CHANGE - ANGLE_CHANGE * .5;

           // Calcula la fuerza de wander
           var wanderForce;
           wanderForce = circleCenter.add(displacement);
           // Aplicamos la fuerza calculada
           vehiculo.body.velocity = wanderForce;




    }

    function arrive(seguidor, objetivo){
	    //Obtengo VectorDeseado
	    vectorDeseado = calcularVelocidadDeseada(seguidor, objetivo);

	    //Obtengo el vector Steering
	    vectorSteeringForce = calcularSteeringForce(seguidor, vectorDeseado);

	    //aplico el vector de fuerza al seguidor
	    aplicarVectorDeFuerza(seguidor,vectorSteeringForce);

    }

    function flocking(boids,game){

      // number of boids (bird-oid objects)
      var boidsAmount = boids.length;
      // speed of each boid, in pixels per second
      var boidSpeed = 100;
      // radius of sight of the boid
      var boidRadius = 500;
      // array which will contain all boids
      //var boids = [];

      // temp array to calculate centroid
      var centroidArray = [];
      // looping through each boid
      for(var i = 0; i < boidsAmount; i++){
           // for each boid, looping through each boid
           for(var j = 0; j < boidsAmount; j++){
                // if the boid is not the current boid and the boid is within boid radius...
                if(i != j && ((boids[i].x-boids[j].x)+(boids[i].y-boids[j].y)) < boidRadius){
                     // pushing the boid into centroid array
                     centroidArray.push(boids[j]);
                }
           }
           // if centroidArray is populated, that is if there were boids nearby the current boid...
           if(centroidArray.length > 0){
                // calculating the centroid
                var centroid = Phaser.Geom.Point.GetCentroid(centroidArray);
           }
           else{
                // just tossing a random point
                var randomPoint = new Phaser.Geom.Point(Math.abs(Math.random()*800), Math.abs(Math.random()*600));
                var centroid = new Phaser.Geom.Point(randomPoint.x, randomPoint.y);
           }
           // rotating the boid towards the centroid
           boids[i].body.angle = Phaser.Math.Angle.BetweenPoints(boids[i],centroid);
           // moving the boid towards the centroid
           //Phaser.physics.moveTo(boid[i],centroid.x, centroid.y, boidSpeed);
           seek(boids[i],centroid);
           //game.physics.arcade.moveToPointer(boids[i],100);
       }
    }

    function flee(vehiculo, objetivo){
            //Obtengo VectorDeseado
            var VectorDeseado = calcularVelocidadDeseada(vehiculo, objetivo);

            //Obtengo el vector Steering
            var vectorSteeringForce = - calcularSteeringForce(vehiculo.body.velocity, VectorDeseado);

            //aplico el vector de fuerza al vehiculo
            aplicarVectorDeFuerza(vehiculo,vectorSteeringForce);

       }

    function getCentroide(points){
        if (points.lenght > 0) {
          var x_acc = 0;
          var y_acc = 0;

          for (i=0; i < points.length; i++) {
            x_acc += points[i].x;
            y_acc += points[i].y;
            };

          var x_centroid = x_acc / points.lenght
          var y_centroid = y_acc / points.lenght

        }
        return [x_centroid,y_centroid];
    }

    function setAngle(vector, value){
          var len = vector.length();
          vector.x = Math.cos(value) * len;
          vector.y = Math.sin(value) * len;
       }

function calcularVelocidadDeseada(vehiculo,objetivo) {
     // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION VEHICULO) * maximaVelocidad

     var VectorDeseado=new Phaser.Math.Vector2(objetivo.x,objetivo.y);
     //VectorDeseado.subtract(new Phaser.Math.Vector2(vehiculo.x,vehiculo.y));
     //var VectorDeseado=objetivo;
     VectorDeseado.subtract(vehiculo);


     //Arrive
     distancia=VectorDeseado.length();

     VectorDeseado.normalize();
     VectorDeseado.multiply(new Phaser.Math.Vector2(MAX_SPEED, MAX_SPEED));

     //Arrive
     if(distancia<MAX_DIST){
         valor=distancia / MAX_DIST;
         VectorDeseado.multiply(new Phaser.Math.Vector2(valor, valor));
     }
     /***********************/

//flee
     //VectorDeseado.multiply(new Phaser.Math.Vector2(-vehiculo.MAX_SPEED, -vehiculo.MAX_SPEED));
    return VectorDeseado;
 }

function calcularSteeringForce(vehiculo,VectorDeseado){
    // Calculo el vector Steering VectorDeseado-Velocidad

    var vectorSteeringForce = VectorDeseado;
    vectorSteeringForce.subtract(vehiculo);
    return vectorSteeringForce;
}

function aplicarVectorDeFuerza(vehiculo,vectorSteeringForce){

    //Calculo la nueva velocidad y posicion del vehiculo sumando la posicion con el vector de fuerza
    vehiculo.angle=vehiculo.body.velocity.angle()*57.2958;
    vehiculo.body.velocity.add(vectorSteeringForce);

}
