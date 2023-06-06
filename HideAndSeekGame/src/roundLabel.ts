import { canvas } from "@dcl/ui-scene-utils";

export const roundCounterLabel = new UIText(canvas);
roundCounterLabel.visible = false;
function createRoundLabel() {
  //roundCounterLabel.value = "round: 0";
  roundCounterLabel.fontSize = 30;
  roundCounterLabel.width = 50;
  roundCounterLabel.height = 50;
  roundCounterLabel.vAlign = "top";
  roundCounterLabel.hAlign = "right";
  roundCounterLabel.positionX = -670;
  roundCounterLabel.positionY = 70;
  roundCounterLabel.visible = true;
}
createRoundLabel();

export const highestRoundCounterLabel = new UIText(canvas);
highestRoundCounterLabel.visible = false;
function createHighestRoundLabel() {
  //highestRoundCounterLabel.value = "round: 0";
  highestRoundCounterLabel.fontSize = 30;
  highestRoundCounterLabel.width = 50;
  highestRoundCounterLabel.height = 50;
  highestRoundCounterLabel.vAlign = "top";
  highestRoundCounterLabel.hAlign = "right";
  highestRoundCounterLabel.positionX = -730;
  highestRoundCounterLabel.positionY = 30;
  highestRoundCounterLabel.visible = true;
}
createHighestRoundLabel();
