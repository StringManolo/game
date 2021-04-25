const game = () => {
  let lives = 10;
  let score = 0;

  let level = 1;
  let timeObstacles = 2000; /* 1000 = 1 obstacle generated per second */
  let speedObstacles = 25; /* 100 = 10 pixels per second */

  const canvas = $("#gameCanvas");
  const cWidth = canvas.width;
  const cHeight = canvas.height;
  const ctx = canvas.getContext("2d");
  let cData = ctx.getImageData(0, 0, cWidth, cHeight);
  const vCanvas = cData;

  const drawPixel = (x, y, r, g, b, a) => {
    const index = (x + y * cWidth) * 4;
    cData.data[index + 0] = r;
    cData.data[index + 1] = g;
    cData.data[index + 2] = b;
    cData.data[index + 3] = a;
  }
  
  
  let airPlane = [
    [4, cHeight / 2, 0, 10, 150, 180], 
    [5, cHeight / 2, 0, 10, 150, 255],
    [6, cHeight / 2, 0, 20, 200, 255],
    [7, cHeight / 2, 0, 20, 200, 255],
    [8, cHeight / 2, 0, 20, 200, 255],
    [9, cHeight / 2, 0, 80, 100, 255],

    [7, cHeight / 2 - 1, 0, 20, 20, 200],
    [7, cHeight / 2 + 1, 0, 20, 20, 200],
    [6, cHeight / 2 + 2, 0, 20, 20, 200],
    [6, cHeight / 2 - 2, 0, 20, 20, 200],
    [5, cHeight / 2 + 3, 0, 20, 20, 200],
    [5, cHeight / 2 - 3, 0, 20, 20, 200],
    [4, cHeight / 2 - 4, 0, 0, 0, 40],
    [4, cHeight / 2 + 4, 0, 0, 0, 40]
  ];

  const drawAirplane = airPlane => {
    airPlane.forEach( part => drawPixel(...part) );
    ctx.putImageData(cData, 0, 0);
  }

  const clearAirplane = airPlane => {
    airPlane.forEach( part => {
      part[5] = 0;
      drawPixel(...part);
    });
    ctx.putImageData(cData, 0, 0);
  }

  const move = (airPlane, direction) => {
    const oldPlane = JSON.parse(JSON.stringify(airPlane));
    airPlane = airPlane.map( part => {
      switch (direction) {
        case "top":
          --part[1];
          if (part[1] < 0) {
            part[1] = cHeight;
          }
        break;

        case "bottom":
          ++part[1];
          if (part[1] > cHeight) {
            part[1] = 0;
          }
        break;

        case "right":
          ++part[0];
          if (part[0] > cWidth) {
            part[0] = 0;
          }
        break;

        case "left":
          --part[0];
          if (part[0] < 0) {
            part[0] = cWidth;
          }
        break; 

        default:
          _("FATAL ERROR: No direction chosed to move")
      }
      //drawPixel(...part);
      return part;
    });
    clearAirplane(oldPlane);
    drawAirplane(airPlane);
    ctx.putImageData(cData, 0, 0);
  }


  const moveTop = () => move(airPlane, "top");

  const moveBot = () => move(airPlane, "bottom");

  const moveRight = () => move(airPlane, "right");

  const moveLeft = () => move(airPlane, "left");

  /* For menu ambient while not playing and for fun */
  const IA = (airplane, obstacles) => {
    if (!obstacles) {
      return;
    }

    let detectionSquare = [];
    /* Make detection square on top of airplane */
    for (let i = 0; i < 120; ++i) {
      for (let j = 0; j < 10; ++j) {
        detectionSquare.push([airplane[0][0] + i, airplane[0][1] +j, 255, 0, 0, 160]);
        detectionSquare.push([airplane[0][0] + i, airplane[0][1] -j, 255, 0, 0, 160]);
        if (i < 4) {
          detectionSquare.push([airplane[0][0] - i, airplane[0][1] +j, 255, 0, 0, 160]);
          detectionSquare.push([airplane[0][0] - i, airplane[0][1] -j, 255, 0, 0, 160]);
        }
      }
    }

    detectionSquare.forEach( px => {
      obstacles.forEach( obstacle => {
        if(px[0] === obstacle[0] && px[1] === obstacle[1]) {
          //alert(`Posible colision at ${px[0]} ${px[1]}`);

          if (px[1] > airplane[0][1]) {
            moveTop();
//alert("Moving top to evade colision");
            return true;
          } else {
            moveBot();
//alert("Moving bottom to evade colision")
            return true;
          }
        }
      });
    });



    /* const drawDetection = square => {
      square.forEach( part => drawPixel(...part) );
      ctx.putImageData(cData, 0, 0);
    } */

    //drawDetection(detectionSquare);
  }


  const moveRandom = () => {
    switch (Math.floor(Math.random()*4)+1) {
      case 1:
        IA(airPlane, obstacles) || moveTop();
      break;

      case 2:
        IA(airPlane, obstacles) || moveBot();
      break;

      case 3:
        IA(airPlane, obstacles) || moveRight();
      break;

      case 4:
        IA(airPlane, obstacles) || moveLeft();
    }
  }

  
  /*** Obstacles */
  let obstacles = [];

  const generateObstacle = () => {
    const halfRightScreen = cWidth - (Math.floor(Math.random() * cWidth / 2 + 1));
    const fHeight = Math.floor(Math.random() * cHeight) + 1;
    drawPixel(halfRightScreen, fHeight, 50, 50, 50, 255);
    obstacles.push([halfRightScreen, fHeight, 50, 50, 50, 255]);
    ctx.putImageData(cData, 0, 0);
  }
 
  const clearObstacles = obstacles => {
    obstacles.forEach( obstacle => {
//_(`Making invisible ${obstacle[5]} from ${obstacles}`);
      obstacle[5] = 0;
      drawPixel(...obstacle); 
    });
    ctx.putImageData(cData, 0, 0); 
  }

  const drawObstacles = obstacles => {
    obstacles.forEach( obstacle => drawPixel(...obstacle) );
    ctx.putImageData(cData, 0, 0);
  }

  let livesHud = $("#lives");
  const detectColision = (airplane, obstacles) => {
    obstacles.forEach( obstacle => {
      for(let i in airplane) {
        if (obstacle[0] === airplane[i][0] && obstacle[1] === airplane[i][1]) {
          --lives;
          livesHud.innerText = `Lives: ${lives}`;
          if (lives === 0) {
            alert("Gameover");
            gameover(intervals);
          }
        }
      }
    });
  }
 
  const scoreHud = $("#score");

  const moveObstacles = obstacles => {
    const oldObstacles = JSON.parse(JSON.stringify(obstacles));
    for (let i = 0; i < obstacles.length; ++i) {
      let obstacle = obstacles[i];
      --obstacle[0];
      if (obstacle[0] < 0) {
        //_("Remove obstacle from memory (out of view)");
        //_("Increase score HUD. ActualLevel * 10");
        obstacles.splice(i--, 1);
        ++score;
        scoreHud.innerText = `Score: ${score}`;
      }
    }

    clearObstacles(oldObstacles);
    drawObstacles(obstacles);
    detectColision(airPlane, obstacles);
    ctx.putImageData(cData, 0, 0);
  } 
  

  let levelHud = $("#level");
  let statsHud = $("#stats");
  statsHud.innerText = `Obstacle generated each ${timeObstacles / 1000} seconds
Obstacles speed: ${speedObstacles}`;
  const increaseLevel = () => {
    ++level;
    levelHud.innerText = `Level: ${level}`;
    timeObstacles -= timeObstacles / 2;
    speedObstacles -= speedObstacles / 8;
    statsHud.innerText = `Obstacle generated each ${timeObstacles / 1000} seconds
Obstacles speed: ${speedObstacles}`;
    clearInterval(hGO);
    hGO = setInterval(generateObstacle, timeObstacles);
    clearInterval(hMO);
    hMO = setInterval(() => moveObstacles(obstacles), speedObstacles);
  }

/* For debug */
  const gamepad = () => {
    $("#controls").style.fontSize = "3em";
    ael($("#controls #top"), "click", () => moveTop());
    ael($("#controls #left"), "click", () => moveLeft());
    ael($("#right"), "click", () => moveRight());
    ael($("#bottom"), "click", () => moveBot());

    ael(document, "keydown", e => {
      switch(+e.keyCode) {
        case 38:
          moveTop();
        break;

        case 37:
          moveLeft();
        break;

        case 39: 
          moveRight();
        break;

        case 40:
          moveBot();
      }
    }); 
  }

  const clearScreen = () => {
    let x = 0;
    let y = 0;
    for (let x = 0; x < cWidth; ++x) {
      for (let y = 0; y < cHeight; ++y) {
        drawPixel(x, y, 255, 255, 255, 255);
      }
    }
  }

  const gameover = intervals => {
    intervals.push(hGO);
    intervals.push(hMO);
    intervals.forEach( interval => clearInterval(interval));
    intervals = [];
    clearScreen();
  }


  let intervals = [];

  drawAirplane(airPlane);

  gamepad();

  let hGO = setInterval(generateObstacle, timeObstacles);
  let hMO = setInterval(() => moveObstacles(obstacles), speedObstacles);
  
  /* This is for ambient or for fun intervals.push(setInterval(moveRandom, 5)); */
  intervals.push(setInterval(increaseLevel, 15000));
  

  //drawAirplane(airPlane);
  //clearAirplane(airPlane);



}

ael(window, "load", () => game());

