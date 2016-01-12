package model.viewmodels

import model.dtos.User

case class UserProfileViewModel (user: Option[User]) {
  def hasImage(): Boolean ={
    return user.get.avatarURL.isEmpty
  }
}
