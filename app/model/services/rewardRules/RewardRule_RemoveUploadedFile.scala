package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_RemoveUploadedFile() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.REMOVE_UPLOADED_FILE
  override def getPoints(user_id: UUID): Int = {
    -10
  }
}
