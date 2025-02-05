var floorTiles = [];
var previousScore = 0;

function setupGame() {

    floorTiles = [];
    var floorTile = new FloorTile(vec3.fromValues(0,-1,40));
    floorTiles.push(floorTile);
    var floorTile2 = new FloorTile(vec3.fromValues(0,-1,0));
    floorTiles.push(floorTile2);

}

function drawFloor() {
    for(let i = 0; i < floorTiles.length; i++) {
        floorTiles[i].draw();
    }
}

function updateFloor() {
    for(let i = 0; i < floorTiles.length; i++) {
        floorTiles[i].update();
    }
    if(floorTiles[0].position[2] > 40) {
        floorTiles[0].position[2] = floorTiles[1].position[2] - Math.cos(floorTiles[1].grade) * 40;
        floorTiles[0].position[1] = floorTiles[1].position[1] + Math.sin(floorTiles[1].grade) * 40;
        floorTiles[0].grade = -(Math.floor(Math.random() * 4) + 1)/10;
        floorTiles[0].createTrees();
        camera.currentTile = 1;
    }
    if(floorTiles[1].position[2] > 40) {
        floorTiles[1].position[2] = floorTiles[0].position[2] - Math.cos(floorTiles[0].grade) * 40;
        floorTiles[1].position[1] = floorTiles[0].position[1] + Math.sin(floorTiles[0].grade) * 40;
        floorTiles[1].grade = -(Math.floor(Math.random() * 4) + 1)/10;
        floorTiles[1].createTrees();
        camera.currentTile = 0;
    }
}