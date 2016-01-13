package model.services

import java.util.UUID


class RewardRule_CommentOnConsultation() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.COMMENT_ON_CONSULTATION_ARTICLE
  override def getPoints(user_id: UUID): Int = {

    // reward only if less than 10 comments have been ... by the user

    5;
  }
}
