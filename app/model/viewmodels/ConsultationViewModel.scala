package model.viewmodels
import model.dtos._

class ConsultationViewModel(val consultation:democracit.dtos.Consultation,
                            val allowedAnnotations: List[AnnotationType],
                            val discussionThreads : List[DiscussionThread],
                            val user: Option[model.User])
