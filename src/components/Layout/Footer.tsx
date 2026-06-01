import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">多语种学习平台</span>
            </div>
            <p className="text-gray-400 mb-4">
              专注于提供沉浸式语言学习体验，涵盖英语、日语、韩语等主流语言，帮助用户轻松掌握新语言。
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">首页</a></li>
              <li><a href="/courses" className="text-gray-400 hover:text-white transition-colors">课程中心</a></li>
              <li><a href="/progress" className="text-gray-400 hover:text-white transition-colors">学习进度</a></li>
              <li><a href="/community" className="text-gray-400 hover:text-white transition-colors">学习社区</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">支持语言</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">英语</li>
              <li className="text-gray-400">日语</li>
              <li className="text-gray-400">韩语</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 多语种学习平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
