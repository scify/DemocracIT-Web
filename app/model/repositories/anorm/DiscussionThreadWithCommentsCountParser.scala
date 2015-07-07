package repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object DiscussionThreadWithCommentsCountParser{

  val Parse: RowParser[DiscussionThread] = {

      long("id") ~
      str("tagId") ~
      int("numberOfComments")  map
      {
        case id ~ discussionThreadClientId ~ numberOfComments =>
          DiscussionThread(Some(id),discussionThreadClientId,"",Some(numberOfComments))
      }
  }
}