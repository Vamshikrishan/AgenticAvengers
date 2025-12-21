user_memory = {
    "preferred_work_time": None,
    "likes_breaks": None,
    "stress_prone": False
}

def update_memory(info):
    user_memory.update(info)

def get_memory():
    return user_memory
