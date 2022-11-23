# Datepicker-Customization

This is a short script that uses JS to customize which dates are selectable in a datepicker. It can connect to a DB to fill an array of all of the holiday dates. They get formated a certain way before using function formatDate. It also uses Parsley validation to detect if it should display an error message based on the logic provided to it. It counts two business days out. So if it's a monday, the first day you can select is Thursday. You cannot select today's date. If it's a thursday it needs to go to Tuesday. So it has to detect that in those two business days there are also two weekend days, so it needs to add that to its count for a total of 4 days. If there was a holiday as well on Friday or Monday, it would also count that for a total of 5 days out. 

This script is used to customize a datepicker that is used in the program LaserFiche. I coded this as a request from my boss at work.
