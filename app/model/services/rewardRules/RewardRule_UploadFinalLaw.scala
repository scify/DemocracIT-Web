package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_UploadFinalLaw() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.UPLOAD_FILE_ACTION_ID

  override def getPoints(user_id: UUID): Int = {

    return 10;
  }
}
