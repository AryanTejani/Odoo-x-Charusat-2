const HistoryPanel = ({ history, onSelectConversation, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter history based on search term
    const filteredHistory = history.filter(msg => 
      msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Group conversations by date
    const groupedHistory = filteredHistory.reduce((groups, message) => {
      const date = new Date(message.timestamp || Date.now()).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
    
    return (
      <div className="absolute top-0 left-0 w-80 h-full bg-gray-900 border-r border-gray-800 z-10 shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Conversation History</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 rounded bg-gray-800 text-white border border-gray-700"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-2">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory).map(([date, messages]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs text-gray-400 px-2 py-1">{date}</h3>
                {messages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectConversation(message)}
                    className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors mb-1 text-sm truncate"
                  >
                    {message.text.substring(0, 60)}...
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <History className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
              {searchTerm && <p className="text-xs mt-1">Try a different search term</p>}
            </div>
          )}
        </div>
      </div>
    );
  };
export default HistoryPanel;  