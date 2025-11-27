// OnBoardingGallery.tsx
import image1 from "../../assets/images/Slides/slide1.png";
import image2 from "../../assets/images/Slides/slide2.png";
import image3 from "../../assets/images/Slides/slide3.png";
import image4 from "../../assets/images/Slides/slide4.png";
import image5 from "../../assets/images/Slides/slide5.png";
import image6 from "../../assets/images/Slides/slide6.png";
// import GalleryImage from "./GalleryImage"; // ← 더 이상 사용 안 하면 삭제
import Carousel, { type CarouselItem } from "../animations/Carousel/Carousel";

const slides: CarouselItem[] = [
  { id: 1, title: "채팅", description: "실시간으로 대화해요", icon: null },
  {
    id: 2,
    title: "고민상담소",
    description: "연애 고민을 털어놔요",
    icon: null,
  },
  {
    id: 3,
    title: "네컷만화",
    description: "우리 둘만의 만화 만들기",
    icon: null,
  },
  {
    id: 4,
    title: "공유캘린더",
    description: "기념일/일정을 함께 관리",
    icon: null,
  },
  {
    id: 5,
    title: "공유갤러리",
    description: "사진을 모아 추억을 저장",
    icon: null,
  },
  {
    id: 6,
    title: "화상통화",
    description: "멀리 있어도 얼굴 보고 얘기",
    icon: null,
  },
];

const slideImages = [image1, image2, image3, image4, image5, image6];

export default function OnBoardingGallery() {
  return (
    <div className="onboarding-gallery">
      <Carousel
        items={slides}
        baseWidth={800}
        autoplay={true}
        autoplayDelay={3000}
        pauseOnHover
        loop
        round={false}
        renderItem={(item) => {
          const idx = item.id - 1;
          const img = slideImages[idx];
          return (
            <div className="onboarding-gallery-img-wrapper">
              <img
                className="onboarding-gallery-img"
                src={img}
                alt={item.title}
              />
              <div className="onboarding-gallery-title-description">
                <div className="onboarding-gallery-title">{item.title}</div>
                <div className="onboarding-gallery-description">
                  {item.description}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
