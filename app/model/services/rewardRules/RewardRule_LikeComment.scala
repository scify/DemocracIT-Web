package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_LikeComment() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.LIKE_COMMENT
  override def getPoints(user_id: UUID): Int = {
    1
  }
}
