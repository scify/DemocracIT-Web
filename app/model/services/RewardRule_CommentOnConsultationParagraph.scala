package model.services

import java.util.UUID


class RewardRule_CommentOnConsultationParagraph() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.COMMENT_ON_CONSULTATION_PARAGRAPH
  override def getPoints(user_id: UUID): Int = {
    // reward only if less than 10 comments have been liked today by the user
    2
  }
}
