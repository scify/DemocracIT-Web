package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object DiscussionThreadWithCommentsCountParser{

  val Parse: RowParser[DiscussionThread] = {

      long("id") ~
      str("tagId") ~
      get[Option[Int]]("typeid") ~
      int("numberOfComments")  map
      {
        case id ~ discussionThreadClientId ~ discussionThreadTypeId ~ numberOfComments =>
          DiscussionThread(Some(id),discussionThreadTypeId.get,discussionThreadClientId,"",Some(numberOfComments))
      }
  }
}