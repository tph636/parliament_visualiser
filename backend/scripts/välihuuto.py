class Välihuuto:
    def __init__(self, firstName, lastName, huuto, date, huutoNum):
        self.firstName = firstName
        self.lastName = lastName
        self.huuto = huuto
        self.date = date
        self.huutoNum = huutoNum

    def __repr__(self):
        return f"{self.firstName} {self.lastName}: {self.huuto} on {self.date} (Huuto #{self.huutoNum})"
