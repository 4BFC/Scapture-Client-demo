// import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userData } from '../../dto/atom.interface';
import { userDataAtom } from '../../Atom/atom';

import styles from '../scss/edit-profile.module.scss';
import profileImgDefault from '../../image/scapture-logo.svg';
import pencil from '../../image/pencil.svg';
import {
  getBanana,
  getProfile,
  getSortVideo,
  putProfile,
} from '../../../../apis/api/mypage.api';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Header from '../../../Header/components/Header';

// import profileImg from '../image/profile.webp';

const EditProfile = () => {
  // setProfile(prev => ({
  //   ...prev,
  //   endDate: res.data.endDate,
  //   image: res.data.image,
  //   location: res.data.location,
  //   name: res.data.name,
  //   role: res.data.role,
  //   team: res.data.team,
  // }));

  // userData 한번 더 get 해야 안전하다.

  //recoil
  const [isProfile, setProfile] = useRecoilState<userData>(userDataAtom);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const res = await getProfile();
      const banana = await getBanana();
      const videoSort = await getSortVideo('latest');
      console.log('res', res?.data);
      if (res?.data && banana?.data && videoSort?.data) {
        setProfile(prev => ({
          ...prev,
          endDate: res.data.endDate,
          // image: res.data.image,
          location: res.data.location,
          name: res.data.name,
          role: res.data.role,
          team: res.data.team,
        }));
      }
    };

    fetchProfileInfo();
  }, [setProfile]);

  //useState
  //⚠NOTICE!! : DON'T CHANGE THAT VALUE NAME!!!
  const [isSelectedFileURL, setSelectedFileURL] = useState({
    uploadFile: '',
  });
  console.log(isSelectedFileURL);

  const [isSelectedFile, setSelectedFile] = useState<File | null>(null);
  //⚠NOTICE!! : DON'T CHANGE THAT VALUE NAME!!!

  const [isViewImage, setViewImage] = useState<string>(
    isProfile.image || profileImgDefault,
  );
  const navigate = useNavigate();

  const handleSave = async () => {
    const res = await putProfile(isProfile, isSelectedFile);
    if (res?.status === 200) {
      navigate('/mypage');
    }
  };

  const onSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFile: FileList | null = e.target.files;
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const BlobFile = URL.createObjectURL(file);
      const url = { uploadFile: BlobFile };
      console.log(isSelectedFileURL);
      console.log(BlobFile);
      setViewImage(BlobFile);
      setSelectedFile(file);
      setSelectedFileURL(url);

      return BlobFile;
    } else {
      alert('잘못된 형식입니다. 다시 시도해주세요.');
    }
  };
  //임시로 설정한 useEffect 점검 및 검토 필요
  useEffect(() => {
    if (isSelectedFile) {
      const BlobFile = URL.createObjectURL(isSelectedFile);
      setSelectedFileURL({ uploadFile: BlobFile });
    }
  }, [isSelectedFile]); //, isViewImage, isSelectedFileURL, setSelectedFileURL

  return (
    <div className={styles.test}>
      <Header />
      <div className={styles.editProfile}>
        <div className={styles.profile}>
          <div className={styles.container}>
            <div className={styles.image_box}>
              <div className={styles.box}>
                <img
                  className={styles.image}
                  src={isViewImage} // isSelectedFileURL.uploadFile ||// profileImgDefault
                  alt="SCAPTURE"
                />
              </div>
              <label htmlFor="file-input">
                <div className={styles.modify}>
                  <img className={styles.pencil} src={pencil} alt="" />
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={onSelectedFile}
                    style={{ display: 'none' }}
                  />
                </div>
              </label>
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.header}>기본정보</div>

            <div className={styles.info}>
              <div className={styles.row}>
                <div className={styles.label}>이름</div>

                <div className={styles.input}>
                  <input
                    className={styles.value}
                    type="text"
                    // placeholder="이름"
                    placeholder={isProfile.name}
                    // value={isProfile.name}
                    onInput={e => {
                      setProfile(prev => ({
                        ...prev,
                        name: e.currentTarget.value,
                      }));
                    }}
                  ></input>
                  {/* <div className={styles.value}>이름</div>*/}
                  <div className={styles.edit}>수정</div>
                </div>
              </div>

              {/* <hr></hr> */}

              <div className={styles.row}>
                <div className={styles.label}>소속팀</div>

                <div className={styles.input}>
                  <input
                    className={styles.value}
                    type="text"
                    // placeholder="소속팀"
                    placeholder={isProfile.team}
                    // value={isProfile.team}
                    onInput={e => {
                      setProfile(prev => ({
                        ...prev,
                        team: e.currentTarget.value,
                      }));
                    }}
                  />
                  {/* <div className={styles.value}>소속팀</div>*/}
                  <div className={styles.edit}>수정</div>
                </div>
              </div>

              {/* <hr></hr> */}

              <div className={styles.row}>
                <div className={styles.label}>활동지역</div>

                <div className={styles.input}>
                  <input
                    className={styles.value}
                    type="text"
                    // placeholder="활동지역"
                    placeholder={isProfile.location}
                    // value={isProfile.location}
                    onInput={e => {
                      setProfile(prev => ({
                        ...prev,
                        location: e.currentTarget.value,
                      }));
                    }}
                  />
                  {/* <div className={styles.value}>활동지역</div> */}
                  <div className={styles.edit}>수정</div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Link to="/mypage" style={{ textDecoration: 'none' }}>
                <div className={styles.cancel}>취소</div>
              </Link>
              <div
                className={styles.save}
                style={{ textDecoration: 'none' }}
                onClick={handleSave}
              >
                <Link to="/mypage">저장하기</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
