import sys
import cv2
import dlib
import time
import imutils

from scipy.spatial import distance as dist
from imutils import face_utils

def calculate_ear(eye):

    delta_y1 = dist.euclidean(eye[1], eye[5])
    delta_y2 = dist.euclidean(eye[2], eye[4])

    delta_x1 = dist.euclidean(eye[0], eye[3])

    return (delta_y1 + delta_y2) / (2 * delta_x1)

cam = cv2.VideoCapture(0)

blink_thresh = 0.2
frame_counter = 0
frame_limit = 4
blink_counter = 0

(L_start, L_end) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
(R_start, R_end) = face_utils.FACIAL_LANDMARKS_IDXS['right_eye']   

detector = dlib.get_frontal_face_detector()
landmark_predict = dlib.shape_predictor('engine/shape_predictor_68_face_landmarks.dat')

while True:
    _, frame = cam.read()
    frame = imutils.resize(frame, width=640)

    img_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = detector(img_gray)

    for face in faces:
        shape = landmark_predict(img_gray, face)
        shape = face_utils.shape_to_np(shape)

        left_eye = shape[L_start:L_end]
        right_eye = shape[R_start:R_end]

        left_ear = calculate_ear(left_eye)
        right_ear = calculate_ear(right_eye)

        avg = (left_ear + right_ear) / 2
        # if blinking frame counted
        if avg < blink_thresh:
            frame_counter += 1
        # check if blinking frame not detected
        else:
            if frame_counter >= frame_limit:
                blink_counter += 1
                frame_counter = 0
                cv2.putText(frame, 'Blink Detected', (30, 30),
                            cv2.FONT_HERSHEY_DUPLEX, 1, (0, 200, 0), 1)
            else:
                frame_counter = 0
                

        # sys.stdout.flush
        # print

    # cv2.imshow("Video", frame)
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

cam.release()
cv2.destroyAllWindows()