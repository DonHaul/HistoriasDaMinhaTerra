import multiprocessing as mp
from random import randint
from time import sleep

def my_func(*args):
    print('my_func:', args)
    index, x = args
    sleep(randint(1, 3))  # Take a varying amount of time to finish.
    print("Conlcuded")
    return index, x*x  # Return result index and value.

if __name__ == '__main__':

    result_list = []

    def errorhandler(exc):
        print('Exception:', exc)

    def log_result(result):
        # This is called whenever my_func() returns a result.
        # result_list is modified only by the main process, not the pool workers.
        print("RESULT")
        result_list.append(result)

    
    pool =  mp.Pool()
    for x in (1,2):

    pool.starmap_async(my_func,zip((1,2),(3,4)) , callback=log_result,   error_callback=errorhandler)
    pool.close()
    
    print("INFO")
    sleep(5)
    print('result_list:', result_list)
    sorted_results = [x[1] for x in sorted(result_list)]
    print('sorted results:', sorted_results)