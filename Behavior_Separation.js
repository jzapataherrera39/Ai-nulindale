/**
 * Comportamiento que sigue Seek en x al target
 * 
 * @param {type} game
 * @param {type} posx
 * @param {type} posy
 * @param {type} key
 * @param {type} frame
 * @param {type} target
 * @returns {Behavior_Separation}
 */

var vector = [];
var cantElementos = 0;

function Behavior_Separation(game, posx, posy, key, frame, target) {

    vector[cantElementos] = Behavior.call(this, game, posx, posy, key, frame, target);
    
    cantElementos++;

    this.sprite.body.collideWorldBounds = true;
    this.vecReference = new Phaser.Point(0, 0);

    this.sentido = 1;
    this.max_speed = 300;
    this.max_force = 10;
    this.min_speed = 0;
    this.max_distance = 100;          //inicia el AREA de arrival

    return this;
}
Behavior_Separation.prototype = Object.create(Behavior.prototype); //Defino que es sub clase de Sprite.

Behavior_Separation.prototype.constructor = Behavior_Separation;



Behavior_Separation.prototype.update = function () {
    

        this.separate();
    
};

Behavior_Separation.prototype.separate = function () {
    this.sprite.body.velocity = this.calcularSeparationVelocity();

}

Behavior_Separation.prototype.calcularSeparationVelocity = function () {
    // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION this.sprite) * maximaVelocidad

    var vectorSeparation = new Phaser.Point();

    for (var i = 0; i < cantElementos; i++)
    {
        var target=vector[i];
        if (this !== target)
        {

            var distancia = this.distanciaEntre(target);
            //console.log(distancia);
            if (distancia < this.max_distance)
            {
                //aca tiene q reducir
                //vectorSeparation = Phaser.Point.subtract(this.sprite.position, target.sprite.position);
                //vectorSeparation = vectorSeparation.add(vectorSeparation.x, vectorSeparation.y);

                vectorSeparation.x += target.sprite.body.x - this.sprite.body.x;

                vectorSeparation.y += target.sprite.body.y - this.sprite.body.y;
                
                vectorSeparation.x *=-1;
                vectorSeparation.y *=-1;
                vectorSeparation = vectorSeparation.normalize();
                vectorSeparation.x*=distancia;
                vectorSeparation.y*=distancia;
            }
        }
    }
    return vectorSeparation;
}

Behavior_Separation.prototype.calcularSteeringForce = function (vectorDesired) {

    //Calculo el vector de fueza = vector deseado - velocidad actual del this.sprite
//steering = steering / mass la masa como se calucula???

    var vectorSteeringForce;
    vectorSteeringForce = Phaser.Point.subtract(vectorDesired, this.sprite.body.velocity);


    //limito la magnitud del vector, es decir la fuerza que se le va a aplicar
    if (vectorSteeringForce.getMagnitudeSq() > (this.max_force * this.max_force))
    {
        vectorSteeringForce.setMagnitude(this.max_force);
    }

    return vectorSteeringForce;
}

Behavior_Separation.prototype.aplicarVectorDeFuerza = function (vectorSteeringForce) {

    //Calculo la nueva velocidad y posicion del this.sprite sumando la posicion con el vector de fuerza
    this.sprite.body.velocity.add(vectorSteeringForce.x, vectorSteeringForce.y);

    //si la velocidad nueva es mayor a la maxima velocidad determinada, se deja la maxima.
    if (this.sprite.body.velocity.getMagnitudeSq() > (this.max_speed * this.max_speed)) {
        this.sprite.body.velocity.setMagnitude(this.sentido * this.max_speed);
    }
}

Behavior_Separation.prototype.distanciaEntre = function (target)
{
    var dx = target.sprite.x - this.sprite.x;
    var dy = target.sprite.y - this.sprite.y;
    return Math.sqrt((dx * dx) + (dy * dy));
}


