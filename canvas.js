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
    [5, cHeight / 2, 0, 20, 150, 255],
    [6, cHeight / 2, 0, 20, 150, 255],
    [7, cHeight / 2, 0, 20, 150, 255],
    [8, cHeight / 2, 0, 20, 150, 255],
    [9, cHeight / 2, 0, 20, 150, 255],

    [8, cHeight / 2 - 1, 0, 20, 20, 200],
    [8, cHeight / 2 + 1, 0, 20, 20, 200],
  ]; 


  const drawAirplane = airPlane => {
    airPlane.forEach( part => drawPixel(...part) );
    ctx.putImageData(cData, 0, 0);
  }

  drawAirplane(airPlane);

  const moveTop = () => {
     
  }

}

game();
