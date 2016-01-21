package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_UploadedFileRatedDislike() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.UPLOADED_FILE_RATED_DISLIKE
  override def getPoints(user_id: UUID): Int = {
    -7
  }
}
