package model.viewmodels

import model.dtos.User

case class UserProfileViewModel (user: Option[User], totalUserPoints: Int) {
  def hasImage(): Boolean ={
    return !(user.get.avatarURL.isEmpty || user.get.avatarURL == None)
  }
}
