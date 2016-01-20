package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_CommentOnConsultationArticle() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.COMMENT_ON_CONSULTATION_ARTICLE
  override def getPoints(user_id: UUID): Int = {
    // reward only if less than 10 comments have been liked today by the user
    1
  }
}
