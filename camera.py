import cv2

class Videocamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0+cv2.CAP_DSHOW)
        cap.set(3, 800)
        cap.set(4, 600)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        time = 0
        while True:
            _, frame = cap.read()
            time += 1
            if time >= 1000:
                break

            cv2.imshow('camera', cv2.resize(frame, (600, 400)))

        cap.release()
        cv2.destroyAllWindows()
