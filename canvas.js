const game = () => {
  const canvas = $("#gameCanvas");
  const cWidth = canvas.width;
  const cHeight = canvas.height;
  const ctx = canvas.getContext("2d");
  let cData = ctx.getImageData(0, 0, cWidth, cHeight);

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

/*
  let airPlane = [
    [5, cHeight / 2, 0, 20, 150, 255],
    [6, cHeight / 2, 0, 20, 150, 255],
    [7, cHeight / 2, 0, 20, 150, 255],
    [8, cHeight / 2, 0, 20, 150, 255],
    [5, cHeight / 2 - 1, 0, 20, 150, 255],
    [6, cHeight / 2 - 1, 0, 20, 150, 255],
    [7, cHeight / 2 + 1, 0, 20, 150, 255],
    [8, cHeight / 2 + 1, 0, 20, 150, 255]
  ];
*/

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

  /* For menu ambient while not playing */
  const moveRandom = () => {
    switch (Math.floor(Math.random()*4)+1) {
      case 1:
        moveTop();
      break;

      case 2:
        moveBot();
      break;

      case 3:
        moveRight();
      break;

      case 4:
        moveLeft();
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
 
  const moveObstacles = obstacles => {
    const oldObstacles = JSON.parse(JSON.stringify(obstacles));
    obstacles = obstacles.map( obstacle => {
      --obstacle[0];
      if (obstacle[0] < 0) {
        //_("Remove obstacle from memory (out of view)");
        //_("Increase score HUD. ActualLevel * 10");
      }
      return obstacle;
    });
    clearObstacles(oldObstacles);
    drawObstacles(obstacles);
    ctx.putImageData(cData, 0, 0);
  } 
  



  setInterval(generateObstacle, 1300);
  setInterval(() => moveObstacles(obstacles), 10);

  drawAirplane(airPlane);
  //clearAirplane(airPlane);

  setInterval(moveRandom, 60);


}

game();
