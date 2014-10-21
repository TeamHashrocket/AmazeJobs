test("login", function() {
	
});

test("testing Board", function() {
	var init = [[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,1,1],[0,0,0,1,1]];
    var board = new Board(init);
    equal(board.isCellAlive(0,0), false, "input dead");
    equal(board.isCellAlive(0,4) && board.isCellAlive(1,4) && board.isCellAlive(2,4)
          && board.isCellAlive(3,3) && board.isCellAlive(3,4) && board.isCellAlive(4,3)
          && board.isCellAlive(4,4), true, "input alive");
    board.update();
    equal(board.isCellAlive(0,0) || board.isCellAlive(0,4) || board.isCellAlive(3,4) || board.isCellAlive(3,3), false, "update dead");
    equal(board.isCellAlive(1,3) && board.isCellAlive(1,4) && board.isCellAlive(2,4) && board.isCellAlive(4,3) && board.isCellAlive(4,4), true, "update alive")
});