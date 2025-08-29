import Sidebar from "../../components/layout/creator/SideBar";
import { useNavigate } from 'react-router-dom';

const CreateEventComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-grow flex items-center justify-center p-4 " >
                <div className="w-[950px] h-[280px] flex items-center rounded-2xl overflow-hidden  mb-100">
                    <div className="relative w-full h-full flex items-center">
                        <div
                            className="w-1/2 h-full bg-[#A5F1E9] rounded-xl flex items-center mr-4 justify-center"
                        >
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 text-center">
                            <span className="block text-3xl font-semibold text-black mb-6">
                                Create New Events Here
                            </span>
                            <button
                                onClick={() => navigate('/creator/create-event')}
                                className="bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:opacity-90 transition-all duration-300"
                            >
                                Create New Event
                            </button>
                        </div>

                        <div
                            className="w-1/2 h-full bg-[#E5D1FA] rounded-xl flex items-center ml-4 justify-center"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventComponent;