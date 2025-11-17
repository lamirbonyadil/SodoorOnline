def default_file_path():
    return "default/profile_256x256.png"

def get_image_file_path(self, filename):
    base_path = ''
    if self.user.role == 'S':
        base_path += "students/"
    elif self.user.role == 'I':
        base_path += "institutes/"

    return f"{base_path}/{self.user.username}/{filename}"