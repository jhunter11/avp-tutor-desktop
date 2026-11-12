class TutorError(Exception):
    def __init__(self, message, status=422, code='invalid_request'):
        super().__init__(message)
        self.status = status
        self.code = code
