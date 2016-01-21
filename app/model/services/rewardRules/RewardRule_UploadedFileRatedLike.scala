package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_UploadedFileRatedLike() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.UPLOADED_FILE_RATED_LIKE
  override def getPoints(user_id: UUID): Int = {
    5
  }
}
