const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/app/(dashboard)/schedule/page.tsx', 'utf8');

const oldLoading = `{loading ? (
                  <div className="flex justify-center items-center h-20 opacity-50"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : (`;

const newLoading = `{loading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200/50 dark:bg-gray-700/30 h-24 rounded-xl border border-gray-100 dark:border-gray-800" />
                    ))}
                  </div>
                ) : (`;

content = content.replace(oldLoading, newLoading);
fs.writeFileSync('C:/ventoo-calendar/src/app/(dashboard)/schedule/page.tsx', content);
